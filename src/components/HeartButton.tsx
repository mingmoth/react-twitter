import { useSession } from "next-auth/react"
import { VscHeart, VscHeartFilled } from "react-icons/vsc"

type HeartButtonProps = {
    likeCount: number
    likedByMe: boolean
}

export default function HeartButton({
    likeCount,
    likedByMe
}: HeartButtonProps) {
    const session = useSession()
    const HeartIcon = likedByMe ? VscHeartFilled : VscHeart

    if(session.status !== 'authenticated') {
        return (
            <div className="mb-1 mt-1 flex items-center gap-1 self-start text-gray-500">
                <HeartIcon />
                <span>{likeCount}</span>
            </div>
        )
    }

    return (
        <button>
            <div
                className={`group flex items-center gap-1 self-start transition-colors duration-200 ${
                    likedByMe
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
                }`}
            >
                <HeartIcon
                    className={`transition-colors duration-200 ${
                        likedByMe
                            ? "fill-red-500"
                            : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
                    }`}
                />
                <span>{likeCount}</span>
            </div>
        </button>
    )
}