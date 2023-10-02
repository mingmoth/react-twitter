import { useSession } from 'next-auth/react';
import Button from '~/components/button';
import ProfileImage from './ProfileImage';

export default function NewTweetForm() {
    const session = useSession();

    if(session.status !== 'authenticated') return
    const user = session.data?.user
    return (
        <form
            action=""
            className="flex flex-col gap-2 border-b px-4 py-2"
        >
            <div className="flex gap-2">
                <ProfileImage src={session.data.user.image} />
                <textarea
                    name="newTweet"
                    id="newTweet"
                    className="flex-grow resize-none overflow-hidden p-2 text-lg outline-none"
                    placeholder="What's happening?"
                ></textarea>
            </div>
            <Button className='self-end'>Tweet</Button>
        </form>
    )
}