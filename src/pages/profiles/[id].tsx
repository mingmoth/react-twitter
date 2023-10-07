import type { GetServerSidePropsContext, GetStaticPaths, InferGetServerSidePropsType, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import { ssgHelper } from "~/server/api/sshHelper";
import { api } from "~/utils/api";

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
            <h1>{user.name}</h1>
        </>
    )
}

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

export default ProfilePage;