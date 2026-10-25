import { Button, List, ListItem } from "@/shared/ui";
import type { AvailableBank } from "../api";

type Props = {
  banks: AvailableBank[] | undefined;
  loading: boolean;
  onOpen: () => void;
  onConnect: (bank: AvailableBank) => void;
};

export function BankPicker({ banks, loading, onOpen, onConnect }: Props) {
  return (
    <>
      <h2>Añadir un banco</h2>
      {!banks ? (
        <Button variant="primary" disabled={loading} onClick={onOpen}>
          Conectar un banco
        </Button>
      ) : (
        <List>
          {banks.map((b) => (
            <ListItem key={`${b.name}${b.country}`} aria-label={b.name}>
              <span>{b.name}</span>
              <Button onClick={() => onConnect(b)}>Conectar</Button>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
