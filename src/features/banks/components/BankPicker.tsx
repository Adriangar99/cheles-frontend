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
      <h2>añadir un banco</h2>
      {!banks ? (
        <button type="button" className="btn primary" disabled={loading} onClick={onOpen}>
          conectar un banco
        </button>
      ) : (
        <div className="card">
          {banks.map((b) => (
            <div className="row" key={`${b.name}${b.country}`}>
              <span>{b.name}</span>
              <button type="button" className="btn" onClick={() => onConnect(b)}>
                conectar
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
