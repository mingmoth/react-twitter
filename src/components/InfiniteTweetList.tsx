import InfiniteScroll from "react-infinite-scroll-component"
// components
import TweetCard, { type Tweet } from '~/components/TweetCard';

type InfiniteTweetListProps = {
    isLoading: boolean
    isError: boolean
    hasMore: boolean
    fetchNewTweets: () => Promise<unknown>
    tweets?: Tweet[]
}

export default function InfiniteTweetList({
    tweets,
    isError,
    isLoading,
    fetchNewTweets,
    hasMore
}: InfiniteTweetListProps) {
    if(isLoading) {
        return <h1>Loading...</h1>
    }
    if(isError) {
        return <h1>Error...</h1>
    }
    if(tweets == null || tweets?.length === 0) {
        return (
            <h1 className="my-4 text-center text-2xl text-gray-500">
                No Tweets
            </h1>
        )
    }
    return (
        <ul>
            <InfiniteScroll
                dataLength={tweets?.length}
                hasMore={hasMore}
                next={fetchNewTweets}
                loader={"Loading..."}
            >
                {tweets.map((tweet) => {
                    return (
                        <TweetCard
                            key={tweet.id}
                            {...tweet}
                        />
                    )
                })}
            </InfiniteScroll>
        </ul>
    )
}