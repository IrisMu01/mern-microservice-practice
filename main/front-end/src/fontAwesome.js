import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faDog,
    faHouse,
    faPaw,
    faPlantWilt,
    faSeedling,
    faSkull,
    faTree,
    faWater,
    faWheatAwn
} from '@fortawesome/free-solid-svg-icons';

export const loadIcons = () => {
    library.add(
        faDog,
        faHouse,
        faPaw,
        faPlantWilt,
        faSeedling,
        faSkull,
        faTree,
        faWater,
        faWheatAwn
    );
};