import { useSession } from 'next-auth/react';
import { FormEvent, useCallback, useLayoutEffect, useRef, useState } from 'react';
// components
import Button from '~/components/button';
import ProfileImage from './ProfileImage';
import { api } from '~/utils/api';

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if(textArea == null) return;

    textArea.style.height = "0"
    textArea.style.height = `${ textArea.scrollHeight }px`
}

export default function NewTweetForm() {
    const session = useSession();

    if(session.status !== 'authenticated') return;

    return (
        <TweetForm />
    )
}

function TweetForm() {
    const session = useSession();
    const [inputValue, setInputValue] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea)
        textAreaRef.current = textArea
    }, [])

    useLayoutEffect(() => {
        if(textAreaRef.current === null) return
        updateTextAreaSize(textAreaRef.current)
    }, [inputValue])

    const createTweet = api.tweet.create.useMutation({
        onSuccess: () => setInputValue("")
    })

    if(session.status !== 'authenticated') return null;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        createTweet.mutate({ content: inputValue })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 border-b px-4 py-2"
        >
            <div className="flex gap-2">
                <ProfileImage src={session.data.user.image} />
                <textarea
                    ref={inputRef}
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