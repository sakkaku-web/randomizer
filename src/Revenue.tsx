import { useEffect, useState } from 'react';

const COMPANIES_KEY = 'myin-revenue-companies';
const TX_KEY = 'myin-revenue-transactions';

interface CompanyTransaction {
  company: string;
  value: number;
  date: number;
}

const DAYS = 31;
const BUTTON = 'px-2 py border hover:bg-slate-100';

export function Revenue() {
  const [newCompany, setNewCompany] = useState('');
  const [companies, setCompanies] = useState(
    JSON.parse(localStorage.getItem(COMPANIES_KEY) ?? '[]') as string[]
  );
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem(TX_KEY) ?? '[]') as CompanyTransaction[]
  );

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [displayDate, setDisplayDate] = useState([] as [string?, number?]);

  const addCompany = () => {
    setCompanies([...companies, newCompany]);
    setNewCompany('');
  };

  const removeCompany = (cmp: string) => {
    setCompanies(companies.filter((c) => c !== cmp));
  };

  const resetTransaction = () => {
    setTransactions([]);
  };

  const addTransaction = () => {
    if (!selectedCompany || !selectedValue || !selectedDate) return;

    setTransactions([
      ...transactions,
      {
        company: selectedCompany,
        value: parseFloat(selectedValue),
        date: parseFloat(selectedDate),
      },
    ]);
    setSelectedCompany('');
    setSelectedValue('');
    setSelectedDate('');
  };

  useEffect(() => {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
  }, [companies]);

  const days = [] as number[];
  for (let day = 1; day <= DAYS; day++) {
    days.push(day);
  }

  const grouped = days.reduce(
    (prev, d) => ({
      ...prev,
      [d]: companies.reduce((cPrev, c) => ({ ...cPrev, [c]: [] }), {}),
    }),
    {} as Record<number, Record<string, number[]>>
  );
  transactions.forEach((tx) => {
    grouped[tx.date][tx.company].push(tx.value);
  });

  const sum = (x: number[]) => {
    return x.reduce((p, c) => p + c, 0);
  }

  const copyToClipboard = () => {
    let result = '';
    days.forEach(d => {
        companies.forEach(c => {
            result += sum(grouped[d][c]) + '\t';
        });

        result += '\n';
    });

    navigator.clipboard.writeText(result);
  };


  return (
    <div className="flex flex-col gap-8 p-4 max-w-xl">
      <div className="flex gap-4">
        <input
          value={newCompany}
          className="border px-2"
          placeholder="新店"
          onChange={(e) => setNewCompany(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCompany()}
        />
        <button className={BUTTON} onClick={(e) => resetTransaction()}>
          新月
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap border p-2">
          {companies.map((c) => (
            <button
              className={`flex gap-2 p-2 ${
                selectedCompany === c ? 'bg-slate-100' : ''
              }`}
              key={c}
              onClick={(e) => setSelectedCompany(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={selectedValue}
          placeholder="Value"
          className="border px-2"
          onKeyDown={(e) => e.key === 'Enter' && addTransaction()}
          onChange={(e) => setSelectedValue(e.target.value)}
        />

        <input
          type="number"
          value={selectedDate}
          className="border px-2"
          placeholder="日"
          onKeyDown={(e) => e.key === 'Enter' && addTransaction()}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <table>
        <tr>
          <td>
            <button className={BUTTON} onClick={e => copyToClipboard()}>Copy</button>
          </td>
          {companies.map((c) => (
            <td className="px-2" key={c}>
              <span className="mr-8">{c}</span>
              <button className={BUTTON} onClick={(e) => removeCompany(c)}>
                x
              </button>
            </td>
          ))}
        </tr>

        {days.map((d) => (
          <tr>
            <td className="px-2">{d}</td>
            {companies.map((c) => (
              <td className="px-2" onClick={(e) => setDisplayDate([c, d])}>
                {sum(grouped[d][c])}
              </td>
            ))}
          </tr>
        ))}
      </table>

      {displayDate.length > 0 && (
        <div aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={(e) => setDisplayDate([])}
          ></div>

          <div className="m-8 absolute top-0 left-0 w-[20rem] transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
            <div className="font-bold p-4 text-lg">
              {displayDate[0]} - {displayDate[1]}
            </div>
            <div className="flex flex-col gap-2 p-4">
              {grouped[displayDate[1] as number][displayDate[0] as string].map(
                (v) => (
                  <div>{v}</div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
