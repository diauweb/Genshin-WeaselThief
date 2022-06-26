
let data

export async function getIntrospection () {
    return data = await (await fetch('/api/introspect')).json()
}

export async function getCommits () {
    if (!data) {
        await getIntrospection()
    }
    return data.versions
}
