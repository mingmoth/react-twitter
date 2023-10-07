import type { GetServerSidePropsContext, GetStaticPaths, InferGetServerSidePropsType, NextPage } from "next";
import { ssgHelper } from "~/server/api/sshHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import ProfileImage from "~/components/ProfileImage";
import HoverEffect from "~/components/hover/HoverEffect";
import { getPlural } from "~/helpers/plural";


const ProfilePage: NextPage<InferGetServerSidePropsType<typeof getStaticProps>> = ({
    id,
}) => {
    const { data: user } = api.profile.getById.useQuery( { id })

    if(user == null || user.name == null) {
        return (
            <ErrorPage statusCode={404} />
        )
    }
    return (
        <>
            <Head>
                <title>{`React Twitter ${user.name}`}</title>
            </Head>
            <header
                className="sticky top-0 z-10 flex items-center border-b bg-white
                px-2 py-2"
            >
                <Link href=".." className="mr-2">
                    <HoverEffect>
                        <VscArrowLeft className="h-6 w-6" />
                    </HoverEffect>
                </Link>
                <ProfileImage src={user.image} className="flex-shrink-0"/>
                <div className="ml-4 flex-grow">
                    <h1 className="text-lg font-bold">{user.name}</h1>
                    <div className="text-grey-500 flex flex-wrap">
                        <div className="mr-2">{user.tweetsCount}{" "}{getPlural(user.tweetsCount, "Tweet", "Tweets")}</div>
                        <div className="mr-2">{user.followersCount}{" "}{getPlural(user.followersCount, "Follower", "Followers")}</div>
                        <div>{user.followsCount}{" Following"}</div>
                    </div>
                </div>
            </header>
            <div className="px-4 py-2">{user.name}</div>
        </>
    )
}

export default ProfilePage;

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export async function getStaticProps(context: GetServerSidePropsContext<{ id: string}>) {
    const id = context.params?.id

    if(id == null) {
        return{
            redirect: {
                destination: "/"
            }
        }
    }

    const ssg = ssgHelper()
    await ssg.profile.getById.prefetch({ id })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        }
    }
}