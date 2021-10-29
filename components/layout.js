import Head from 'next/head'
import Image from 'next/image'
import rickImage from '../public/rick.png'

const siteTitle = "Rick and Morty Unofficial Wiki"
export default function Layout({children, title}){
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{title? title : siteTitle}</title>
                <link rel="icon" href="/rick.png"/>
                <meta 
                name='description'
                content="Unofficial Adventure Time's Wiki, provide character's details"
            />
            <meta
                property='og:image'
                content={`https://og-image.vercel.app/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name='og:title' content={siteTitle}/>
            <meta name='twitter:card' content="summary_large_image"/>
            </Head>
            <main className="p-0 m-0">
                <div className="h-30 bg-black flex px-48 py-5 text-white">
                    <Image src={rickImage} className="object-cover" alt="rick" width={50} height={50} />
                    <div className="mt-2 ml-auto mr-3 text-xl">
                     Rick And Morty Unofficial Wiki
                    </div>
                </div>
                <h3 className="text-4xl text-center mt-10">
                    Rick And Morty Unofficial Wiki
                </h3>
                <div className="px-4 py-10">
                    {children}
                </div>
            </main>
        </div>
    )
}