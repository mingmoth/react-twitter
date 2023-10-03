import { useSession } from 'next-auth/react';
import { useState } from 'react';
// components
import Button from '~/components/button';
import ProfileImage from './ProfileImage';

export default function NewTweetForm() {
    const session = useSession();
    const [inputValue, setInputValue] = useState("")

    if(session.status !== 'authenticated') return

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
                    value={inputValue}
                    onChange={ e => setInputValue(e.target.value) }
                    className="flex-grow resize-none overflow-hidden p-2 text-lg outline-none"
                    placeholder="What's happening?"
                ></textarea>
            </div>
            <Button className='self-end'>Tweet</Button>
        </form>
    )
}