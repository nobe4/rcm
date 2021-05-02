import { createRouter, createWebHashHistory } from 'vue-router'

import Rcm from '../views/Rcm.vue'
import Interval from '../views/Interval.vue'
import Scale from '../views/Scale.vue'
import Chord from '../views/Chord.vue'

const routes = [
	{ path: '/rcm', name: 'Rcm', component: Rcm },
	{ path: '/interval', name: 'Interval', component: Interval },
	{ path: '/scale', name: 'Scale', component: Scale },
	{ path: '/chord', name: 'Chord', component: Chord },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
