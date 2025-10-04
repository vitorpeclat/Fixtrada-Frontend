import { Colors } from '@/theme/colors';
import { FilterStatus } from "@/types/FilterStatus";
import { Square, SquareCheckBig } from "lucide-react-native";
import { StyleProp, ViewStyle } from "react-native";

export function SquareIcon({ status, style }: { status: FilterStatus, style?: StyleProp<ViewStyle> }){
    return status === FilterStatus.UNCHECKED ? (
        <Square size={18} color={Colors.secondary} style={style}/>
    ) : (
        <SquareCheckBig size={18} color={Colors.secondary} style={style}/>
    )
}