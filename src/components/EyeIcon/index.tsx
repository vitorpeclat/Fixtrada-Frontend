import { Colors } from '@/theme/colors'
import { FilterStatus } from "@/types/FilterStatus"
import { Eye, EyeOff } from "lucide-react-native"

export function EyeIcon({ status }: { status: FilterStatus}){
    return status === FilterStatus.SHOW ? (
        <Eye size={18} color={Colors.primary}/>
    ) : (
        <EyeOff size={18} color={Colors.primary}/>
    )
}