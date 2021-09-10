<script>
    export let user
    export let messages

    $: timeString = new Date(messages[0].timestamp).toLocaleString()
</script>

<div>
    <span class="header">{user} - {timeString}</span>
    {#each messages as message}
        <span>{message.content}</span>
    {/each}
</div>

<style>
    .header {
        color: gray;
    }
    div {
        display: flex;
        flex-direction: column;
        gap: 0.15em;
    }
</style>
