

import { Loader2 } from 'lucide-react'
import React from 'react'

export default function loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary">
            </div>
        </div>
    )
}
