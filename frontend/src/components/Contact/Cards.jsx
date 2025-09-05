import Card from "./Card"
import studioLocations from "../../Data/studioLocations.json"

const Cards = () => {
    return (
        <section className="flex flex-col gap-4 md:gap-8 lg:gap-12 px-6 md:px-12 lg:px-24">
            {studioLocations.map(location => 
                <Card key={location.id} data={location}/>
            )}
        </section>
    )

}

export default Cards;