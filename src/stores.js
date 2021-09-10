import { derived, writable } from 'svelte/store'

export const messages = writable([])

const shouldCreateNewGroup = (lastGroup, newMessage) =>
    lastGroup.user !== newMessage.user ||
    newMessage.timestamp - lastGroup.messages[0].timestamp > 120_000

export const messageGroups = derived([messages], ([$messages]) =>
    $messages.reduce((groups, next) => {
        const lastGroup = groups[groups.length - 1]
        if (!lastGroup || shouldCreateNewGroup(lastGroup, next)) {
            groups.push({ user: next.user, messages: [next] })
        } else {
            lastGroup.messages.push(next)
        }
        return groups
    }, [])
)
