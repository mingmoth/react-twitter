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
            <div className="mb-1 mt-1 flex items-center gap-1 self-start text-gray-500">
                <HeartIcon />
                <span>{likeCount}</span>
            </div>
        </button>
    )
}