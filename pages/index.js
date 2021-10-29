import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import { filterCharacter, getAllCharacters, getLoadMore } from '../lib/apiHandler'
import ImgComp from '../components/imgComp'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import LoaderComp from '../components/loader'

export async function getStaticProps(context) {
  const data = await getAllCharacters();
  const pages = data.info.pages;
  return {
    props: {
      data,
      pages
    },
    revalidate: 1
  }

}
const handleSubmit = (e) => {
  e.preventDefault();
}

const createButton = (num) => {
  const result = []
  for (let index = 0; index < num; index++) {
    result.push(
      <button className="px-5 py-3 rounded bg-blue-500 text-white hover:bg-blue-600">{index + 1}</button>
    )
  }
  return result
}


let currentPage = 1;
export default function Home({ data, pages }) {
  const [results, setResults] = useState(data.results)
  const [lastData, setLastData] = useState(data.results)
  const [error, setError] = useState(false)
  // let isClicked = false;


  const mergeData = (first, second) => {
    return [...first, ...second]
  }

  const handleLoadMore = async () => {
    // isClicked = true
    currentPage++
    const newData = await getLoadMore(currentPage)
    const final = mergeData(results, newData.results)
    setLastData(final)
    setResults(final)
  }

  const handleFilter = async (e) => {

    setError(false)

    if (e.target.value == '') setResults(lastData)
    if (e.target.value != '') {
      const currentData = await filterCharacter(e.target.value)
      currentData.error ? setError(true) : setResults(currentData.results)
    }
  }

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => (url !== router.asPath) && setLoading(true);
    const handleComplete = (url) => (url === router.asPath) && setLoading(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })


  return (
    <Layout>
      {loading ? <div className="px-2 center w-24 mx-auto mt-24"><LoaderComp/></div> :
        <>
          <div className="grid grid-rows-1">
            <form onSubmit={handleSubmit} className="w-3/4 mx-auto mb-5 text-center">
              <input onChange={handleFilter} placeholder="Search your favorite character" className="px-4 py-1 w-1/2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-opacity-0" type="text" />
              <button type="submit" className="ml-4 px-5 py-1 text-white rounded bg-blue-500 hover:bg-blue-600">search</button>
            </form>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-3 gap-2 w-3/4 mx-auto">
            {error ? <p> no data found </p> : results.map((res) => (
              <div key={res.id}>
                <Link href={`/character/${res.id}`} passHref>
                  <div className="border pb-5 rounded-lg bg-white hover:text-blue-400 cursor-pointer" key={res.id} >

                    <ImgComp url={res.image} title={res.name} />
                    <div className="px-2">
                      <h4>
                        {res.name}
                      </h4>
                      <p className="font-light text-xs">
                        Gender: {res.gender}
                      </p>
                      <div className="flex flex-row">
                        <div className={`rounded-full h-3 w-3 mt-3 ${res.status == 'unknown' ? 'bg-gray-300' : (res.status == 'Dead' ? 'bg-red-400' : 'bg-green-400')}`} />
                        <span className="hover:text-gray-400 mt-1 ml-3">{res.status}</span>
                      </div>
                    </div>
                  </div>
                </Link>

              </div>
            ))}

          </div>
          <div className="flex flex-row w-3/4 mx-auto mt-3">
            <button className="ml-auto px-5 py-2 text-white rounded bg-blue-500 hover:bg-blue-600" onClick={handleLoadMore}>
              Load more
            </button>
          </div>
        </>
      }
    </Layout>
  )
}
