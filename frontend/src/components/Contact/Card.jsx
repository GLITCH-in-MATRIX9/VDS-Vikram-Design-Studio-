const Card = ({data}) => {
    // TODO: Line Heights
    return (
        <article className="flex justify-between gap-4 md:gap-8 px-3 py-4 md:px-6 md:py-8 lg:px-8 lg:py-12 border-[0.5px] border-[#BEBBBC] text-[#3E3C3C] md:border-1 rounded-lg md:rounded-2xl">
            <div className="card-text flex w-full flex-col justify-between">
                <h2 className="font-sora font-semibold uppercase text-base md:text-[28px] lg:text-[40px]">
                {data.city}
                </h2>
                <div className="details flex w-full md:flex-col md:gap-4 lg:flex-row shrink-0 justify-between">
                    <div className="phone">
                        <h3 className="font-sora font-semibold text-xs md:text-base lg:text-xl">Call us:</h3>
                        {data.phone_numbers.map((number, id) => 
                            <p className="text-xs md:text-sm lg:text-base w-[160px] md:w-[224px]" key={id}>{number}</p>)
                        }
                    </div>
                    <div className="address">
                        <h3 className="font-sora font-semibold text-xs md:text-base lg:text-xl">Address:</h3>
                        <p className="text-xs md:text-sm lg:text-base w-[160px] md:w-[224px] ">{data.address}</p>
                    </div>
                </div>
            </div>
            <iframe
                className="shrink-0 grayscale border-0 w-[315px] h-[162px] md:w-[345px] md:h-[250px] lg:w-[420px] lg:h-[304px] rounded-lg med:rounded-2xl"
                src={data.google_maps_iframe_src}
                loading="lazy"
            >

            </iframe>
            
        </article>
    )

}

export default Card;