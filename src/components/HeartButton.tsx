import { useSession } from "next-auth/react"
import { api } from "~/utils/api"
// react-icons
import { VscHeart, VscHeartFilled } from "react-icons/vsc"
// components
import HoverEffect from "./hover/HoverEffect"

type HeartButtonProps = {
    id: string
    likeCount: number
    likedByMe: boolean
}

export default function HeartButton({
    id,
    likeCount,
    likedByMe
}: HeartButtonProps) {
    const session = useSession()
    const HeartIcon = likedByMe ? VscHeartFilled : VscHeart

    const toggleLike = api.tweet.toggleLike.useMutation()

    function handleToggleLike() {
        toggleLike.mutate({ id })
    }

    if(session.status !== 'authenticated') {
        return (
            <div className="mb-1 mt-1 flex items-center gap-1 self-start text-gray-500">
                <HeartIcon />
                <span>{likeCount}</span>
            </div>
        )
    }

    return (
        <button
            className="w-fit"
            disabled={toggleLike.isLoading}
            onClick={handleToggleLike}
        >
            <div
                className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
                    likedByMe
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
                }`}
            >
                <HoverEffect red>
                    <HeartIcon
                        className={`transition-colors duration-200 ${
                            likedByMe
                                ? "fill-red-500"
                                : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
                        }`}
                    />
                </HoverEffect>
                <span>{likeCount}</span>
            </div>
        </button>
    )
}