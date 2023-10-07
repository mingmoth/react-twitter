import { useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "~/utils/api";
import InfiniteTweetList from "../InfiniteTweetList";

const TABS = ["Recent", "Following"] as const;

export default function HomeTweetsSection() {
    const session = useSession();

    const [selectTab, setSelectedTab] = useState<(typeof TABS)[number]>("Recent");
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
        { onlyFollowing: selectTab !== TABS[0] },
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

    return (
        <>
            {session.status === "authenticated" && (
                <div
                    className="w-full flex border-b border-b-gray-200"
                >
                    {TABS.map((tab) => {
                        return (
                            <button
                                className={`px-4 py-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${tab === selectTab
                                    ? "border-b-4 border-b-blue-500 font-bold"
                                    : ""
                                    }`}
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            )}
            <InfiniteTweetList
                tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
                isError={tweets.isError}
                isLoading={tweets.isLoading}
                hasMore={tweets.hasNextPage || false}
                fetchNewTweets={tweets.fetchNextPage}
            />
        </>
    )
}