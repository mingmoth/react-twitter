type Tweet = {
    id: string
    content: string
    createdAt: Date
    likeCount: number
    likedByMe: boolean
    user: {
        id: string
        image: string | null
        name: string | null
    }
}

type InfiniteTweetListProps = {
    isLoading: boolean
    isError: boolean
    hasMore: boolean | undefined
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
            {tweets.map((tweet) => {
                return (
                    <li key={tweet.id}>{ tweet?.content }</li>
                )
            })}
        </ul>
    )
}