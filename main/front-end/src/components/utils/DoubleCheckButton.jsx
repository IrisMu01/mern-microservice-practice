import {useState} from "react";
import Button from "react-bootstrap/Button";

export const DoubleCheckButton = ({defaultVariant, confirmedVariant, size, className, content, onClickDispatch}) => {
    const [ confirmed, setConfirmed ] = useState(null);
    const doClick = () => {
        if (confirmed) {
            onClickDispatch();
            setConfirmed(false);
        } else {
            setConfirmed(true);
        }
    }
    
    return (
        <Button
            variant={confirmed ? confirmedVariant : defaultVariant}
            size={size}
            className={className}
            onClick={doClick}
        >
            {content}
        </Button>
    )
}
