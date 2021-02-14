import { ReactNode } from "react";

type AlertOption = {
	name: string,
	execute?: () => void
}
export type AppAction = {
	showAlert: (content?: ReactNode, actions?: AlertOption[]) => void

}