import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

async function getInfiniteTweets() {
  const currentUserId = ctx.session?.user.id

  const tweets = await ctx.db.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: {
        select: { likes: true }
      },
      likes: currentUserId == null
        ? false
        : { where: { userId: currentUserId } },
      user: {
        select: {
          name: true,
          id: true,
          image: true,
        }
      }
    }
  })

  let nextCursor: typeof cursor | undefined
  if (tweets.length > limit) {
    const lastTweet = tweets.pop()
    if (lastTweet != null) {
      nextCursor = {
        id: lastTweet?.id,
        createdAt: lastTweet?.createdAt,
      }
    }
  }

  return {
    tweets: tweets.map(tweet => {
      return {
        id: tweet.id,
        content: tweet.content,
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        likedByMe: tweet.likes?.length > 0,
        user: tweet.user,
      }
    }),
    nextCursor
  }
}

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const tweet = await ctx.db.tweet.create({
        data: {
          content,
          userId: ctx.session.user.id
        }
      })
      return tweet
    }),

  infiniteFeed: publicProcedure
    .input(z.object({
      cursor: z.object({
        id: z.string(),
        createdAt: z.date()
      }).optional(),
      limit: z.number().optional(),
      onlyFollowing: z.boolean().optional,
    }))
    .query(async ({
      input: { cursor, limit = 10, onlyFollowing = false }, ctx
    }) => {
      const currentUserId = ctx.session?.user.id
      return await getInfiniteTweets({
        ctx,
        cursor,
        limit,
        whereClause: currentUserId == null || !onlyFollowing ? undefined : {
          user: {
            followers: { some: { id: currentUserId } }
          }
        }
      })
    }),

  toggleLike: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = {
        tweetId: id,
        userId: ctx.session.user.id
      }

      const existingLike = await ctx.db.like.findUnique({
        where: { userId_tweetId: data }
      })
      if (existingLike == null) {
        await ctx.db.like.create({ data })
        return { addedLike: true }
      } else {
        await ctx.db.like.delete({
          where: { userId_tweetId: data }
        })
        return { addedLike: false }
      }
    })
});
