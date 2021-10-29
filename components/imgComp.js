import Image from 'next/image'

export default function ImgComp({url, title}){
    return <Image className="object-cover rounded-t-lg" src={url} alt={title} width={250} height={300} />
}