const charsEndpoint = 'https://rickandmortyapi.com/api/character'
const nextCharsEndpoint = 'https://rickandmortyapi.com/api/character/?page='
const getCharacterEndpoint = 'https://rickandmortyapi.com/api/character/'
const getFilteredChars = 'https://rickandmortyapi.com/api/character/?name='

export const getAllCharacters = async () => {
    const res = await fetch(charsEndpoint)
    return res.json()
}

export const getLoadMore = async (num) => {
    const res = await fetch(`${nextCharsEndpoint}${num}`)
    return res.json()
}

export const getAllCharsId = async () => {
    const res = await getAllCharacters()
    const raw = res.results
    const final = Array.from(raw).map(data => {
        return {params: {
            id: data.id.toString()
        }}
    })
    return final
}

export const getCharacter = async (id) => {
    const res = await fetch(`${getCharacterEndpoint}${id}`)
    return res.json()
}

export const filterCharacter = async (name) => {
    const res = await fetch(`${getFilteredChars}${name}`)
    return res.json()
}