<script>
	import { io } from 'socket.io-client'
	import { messageGroups, messages } from './stores'
	import { onMount, tick } from 'svelte';
	import MessageGroup from './components/MessageGroup.svelte';

	const scrollMessagesToBottom = () => {
		if (messagesDiv) {
			messagesDiv.scrollTo(0, messagesDiv.clientHeight)
		}
	}

	$messages = []
	const socket = io()
	socket.on('messages', async (newMessages) => {
		$messages = [...$messages, ...newMessages].sort((a, b) => a.timestamp - b.timestamp)
		await tick()
		scrollMessagesToBottom()
	})

	setContext('socket', socket)

	let newMessage = ''
	const sendMessage = () => {
		if (!user || !newMessage) {
			return
		}
		socket.emit('message', { content: newMessage, user })
		newMessage = ''
	}

	let messageInput
	let usernameInput
	let messagesDiv

	let loggedIn = false
	let user = ''

	const login = async () => {
		loggedIn = true
		await tick()
		messageInput.focus()
		scrollMessagesToBottom()
	}
	const logout = async () => {
		loggedOut = false
		await tick()
		usernameInput.focus()
	}

	onMount(() => usernameInput.focus())
</script>

<main>
	{#if loggedIn}
		<div class="messages" bind:this={messagesDiv}>
			{#each $messageGroups as messageGroup}
				<MessageGroup {...messageGroup}/>
			{/each}
		</div>
		<form on:submit|preventDefault={sendMessage}>
			<input type="text" bind:value={newMessage} bind:this={messageInput} />
			<button type="submit">Send</button>
			<button type="button" on:click={logout}>Logout</button>
		</form>
	{:else}
		<form class="login" on:submit|preventDefault={login}>
			<input placeholder="Username" type="text" bind:value={user} bind:this={usernameInput} />
			<button type="submit">Login</button>
		</form>
	{/if}
</main>

<style>
	.messages {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		flex-grow: 1;
		border-bottom: 1px solid gray;
		gap: 0.75em;
		overflow-y: scroll;
	}

	main {
		padding: 1em;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}	
</style>
