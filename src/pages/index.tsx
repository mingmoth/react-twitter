import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
// api
import { api } from "~/utils/api";
// components
import InfiniteTweetList from "~/components/InfiniteTweetList";
import NewTweetForm from "~/components/NewTweetForm";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const session = useSession();

  const [selectTab, setSelectedTab] = useState<(typeof TABS)[number]>("Recent");

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm />
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
      <RecentTweets />
    </>
  );
};

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage || false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

export default Home;
