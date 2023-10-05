import Image from "next/image"
import { VscAccount } from "react-icons/vsc"

type ProfileImageProps = {
    src?: string | null
    className?: string
}

export default function ProfileImage({
    src,
    className = "",
}: ProfileImageProps) {
    return (
        <div
            className={`relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 ${className}`}
        >
            {src == null
                ? <VscAccount className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                : <Image
                    src={ src || '' }
                    alt="Profile Image"
                    quality={ 100 }
                    fill
                />
            }
        </div>
    )
}