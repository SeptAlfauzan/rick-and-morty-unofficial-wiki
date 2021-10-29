import Layout from "../../components/layout";
import { getAllCharsId, getCharacter } from "../../lib/apiHandler";
import ImgComp from "../../components/imgComp";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import LoaderComp from "../../components/loader";
import Link from 'next/link';



export async function getStaticPaths() {
    const paths = await getAllCharsId();
    // console.log(paths)
    // const paths = [
    //     {params: {
    //         id: '1'
    //     }},
    //     {params: {
    //         id: '2'
    //     }},
    //     {params: {
    //         id: '3'
    //     }},
    // ]
    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const charData = await getCharacter(params.id)
    return {
        props: {
            charData
        },
        revalidate: 1
    }
}

export default function Characters({ charData }) {

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

    if(!charData) return null;
    
    return (
        <Layout title={charData.name}>
            <div className="w-full">
                {loading? <div className="px-2 center w-24 mx-auto my-24"><LoaderComp/></div>:
                <div className="mx-auto w-1/2 flex flex-row gap-4">
                    <div className="flex-col">
                        <ImgComp url={charData.image} title={charData.name} />
                        <div className="flex flex-row">
                            <div className={`rounded-full h-3 w-3 mt-3 ${charData.status == 'unknown' ? 'bg-gray-300' : (charData.status == 'Dead' ? 'bg-red-400' : 'bg-green-400')}`} />
                            <span className="text-lg mt-1 ml-3">{charData.status}</span>
                        </div>
                        <Link href="/" passHref>
                            <button className="py-2 bg-gray-400 rounded-r-full shadow-md text-left pl-3 text-lg  w-3/4 hover:bg-gray-600 hover:shadow-xl mt-3 text-white">back to home</button>
                        </Link>
                    </div>

                    <div className="text-gray-500">
                        <div className="flex flex-col">
                            <h3 className="text-3xl text-black">{charData.name}</h3>
                            <span className="text-lg mt-1">Gender: {charData.gender}</span>
                            <span className="text-lg mt-1">Species: {charData.species}</span>
                            <span className="text-lg mt-1">Origin: {charData.origin.name}</span>
                            <span className="text-lg mt-1">Current location: {charData.location.name}</span>
                        </div>
                    </div>
                </div>
                }
            </div>
        </Layout>
    )
}