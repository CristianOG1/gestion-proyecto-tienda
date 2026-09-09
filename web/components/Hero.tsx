import { getHomeInfo } from "@/lib/get-home-into"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
export const Hero = async () => {
    const {title, description, image} = await getHomeInfo()
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">{title}</h1>

                    <div className="[&>p>strong]:font-bold max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                        <BlocksRenderer content={description}/>
                    </div>
                    <a href="#categories" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 bg-white">
                        Show Categories
                        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <img src={image} alt="mockup"/>
                </div>
            </div>
        </section>
    );
}