import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function SearchBar() {
    return (
        <div className="h-16 p-4 flex items-center gap-4 justify-between w-full">
            <div className='flex gap-2 items-center'>
                <input type="checkbox" />
                <label>Vrf</label>
            </div>
            <div className="flex flex-1 gap-2 items-center p-2 bg-white rounded-lg w-full min-w-0">

                <input className="flex-1 min-w-0 focus:outline-none" type="text" placeholder="Buscar" />
                <button>
                    <MagnifyingGlassIcon className='h-6 w-6' />
                </button>
            </div>
        </div>

    )
}
