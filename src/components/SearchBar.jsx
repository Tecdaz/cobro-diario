import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function SearchBar() {
    return (
        <div className="flex flex-1 gap-2 items-center p-2 bg-white rounded-lg w-full min-w-0">
            <input className="flex-1 min-w-0 focus:outline-none" type="text" placeholder="Buscar" />
            <button>
                <MagnifyingGlassIcon className='h-6 w-6' />
            </button>
        </div>
    )
}
