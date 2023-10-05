import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
// react-icons
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";
// components
import HoverEffect from "./hover/HoverEffect";

export default function SideNav() {
    const session = useSession()
    const user = session.data?.user

    return (
        <nav className="sticky top-0 px-2 py-4">
            <ul className="flex flex-col items-end gap-2 whitespace-nowrap">
                <li>
                    <Link href="/">
                        <HoverEffect>
                            <span className="flex items-center gap-2">
                                <VscHome className="h-6 w-6" />
                                <span className="hidden text-lg md:inline">Home</span>
                            </span>
                        </HoverEffect>
                    </Link>
                </li>
                {user !== undefined && <li>
                    <Link href={`/profiles/${user?.id}`}>
                        <HoverEffect>
                            <span className="flex items-center gap-2">
                                <VscAccount className="h-6 w-6" />
                                <span className="hidden text-lg md:inline">Profile</span>
                            </span>
                        </HoverEffect>
                    </Link>
                </li>}
                {user !== undefined ? (
                    <li>
                        <button onClick={() => void signOut()}>
                            <HoverEffect>
                                <span className="flex items-center gap-2">
                                    <VscSignOut className="h-6 w-6" />
                                    <span className="hidden text-lg md:inline">Log Out</span>
                                </span>
                            </HoverEffect>
                        </button>
                    </li>
                ) : (
                    <li>
                        <button onClick={() => void signIn()}><HoverEffect>
                                <span className="flex items-center gap-2">
                                    <VscSignIn className="h-6 w-6" />
                                    <span className="hidden text-lg md:inline">Log In</span>
                                </span>
                            </HoverEffect>
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    )
}