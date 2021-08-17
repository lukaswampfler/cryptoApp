import React, { useContext } from 'react'
import { View } from "react-native"
import Carousel from 'react-native-snap-carousel'
import AppContext from './AppContext'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'


const CarouselCards = ({data}) => {
  const isCarousel = React.useRef(null)
  return (
    <View>
      <Carousel
        layout="tinder"
        layoutCardOffset={3}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={0}
        useScrollView={true}
        loop={true}
      />
    </View>
  )
}


export default CarouselCards