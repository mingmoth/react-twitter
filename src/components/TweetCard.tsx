import Link from "next/link"
import ProfileImage from "./ProfileImage"

export type Tweet = {
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

export default function TweetCard({
    id,
    content,
    createdAt,
    likeCount,
    likedByMe,
    user,
}: Tweet) {
    return (
        <li
            className="flex gap-4 border-b px-4 py-4"
        >
            <Link href={`/profiles/${user.id}`}>
                <ProfileImage src={user.image}/>
            </Link>
            <div
                className="flex flex-grow flex-col"
            >
                <div className="flex gap-1">
                    <Link
                        href={`/profiles/${user.id}`}
                        className="font-bold outline-none hover:underline focus-visible:underline"
                    >
                        {user.name}
                    </Link>
                </div>
                { content }
            </div>
        </li>
    )
}
