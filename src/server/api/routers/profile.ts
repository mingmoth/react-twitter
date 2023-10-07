import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getById: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({
            input: { id },
            ctx
        }) => {
            const currentUserId = ctx.session?.user.id
            const profile = await ctx.db.user.findUnique({
                where: { id },
                select: {
                    _count: {
                        select: {
                            followers: true,
                            follows: true,
                            tweets: true,
                        }
                    },
                    followers: currentUserId == null ? undefined : {
                        where: { id: currentUserId }
                    },
                    image: true,
                    name: true,
                }
            })

            if(profile == null) return

            return {
                name: profile.name,
                id: id,
                image: profile.image,
                followersCount: profile._count.followers,
                followsCount: profile._count.follows,
                tweetsCount: profile._count.tweets,
                isFollowing: profile.followers.length > 0,
            }
        }),

    toggleFollow: protectedProcedure
        .input(
            z.object({
                userId: z.string()
            })
        )
        .mutation(async({
            ctx,
            input: { userId },
        }) => {
            const currentUserId = ctx.session.user.id
            if(currentUserId === userId) return

            const existingFollow = await ctx.db.user.findFirst({
                where: {
                    id: userId,
                    followers: {
                        some: { id: currentUserId }
                    }
                }
            })

            let addedFollow

            if(existingFollow == null) {
                await ctx.db.user.update({
                    where: { id: userId },
                    data: {
                        followers: {
                            connect: { id: currentUserId }
                        }
                    }
                })
                addedFollow = true
            } else {
                await ctx.db.user.update({
                    where: { id: userId },
                    data: {
                        followers: {
                            disconnect: { id: currentUserId }
                        }
                    }
                })
                addedFollow = false
            }

            return {
                addedFollow
            }
        })
});
