import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { ReactChild, useRef } from "react";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  body: ReactChild | string;
  footer: ReactChild;
};

const Dialog = ({ isOpen, onClose, header, body, footer }: DialogProps) => {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button mr={3} ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              {footer && footer}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Dialog;
