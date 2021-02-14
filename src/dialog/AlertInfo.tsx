import Alert from "./Alert"

type Props = {
	text: string,
	show: boolean,
	actions: {
		hideAlert: () => void,
	},
}

const InfoAlert: React.FunctionComponent<Props> = ({ text, show, actions }: Props) => {
	return null;
};

export default InfoAlert;