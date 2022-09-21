import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

export const MainPage = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  const fetchValues = useCallback(async () => {
    const { data } = await axios.get('/api/values/current');

    setValues(data);
  }, []);

  const fetchIndexes = useCallback(async () => {
    const { data } = await axios.get('/api/values/all');

    setSeenIndexes(data);
  }, []);

  const onInputChange = (event) => setIndex(event.target.value);

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index
    });

    setIndex('');
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchIndexes, fetchValues]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label >Enter your index
          <input type="text" value={index} onChange={onInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {seenIndexes.map(({ number }) => (
        // TODO set unique key
        <span>{number}, </span>
      ))}
      <h3>Calculated values</h3>
      {Object.entries(values).map(([key, value]) => (
        <div key={key}>For index {key} I calculated {value}</div>
      ))}
    </div>
  );
};