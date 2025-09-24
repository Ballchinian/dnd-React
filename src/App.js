import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import ItemBuilder from './components/ItemBuilder/ItemBuilder';
import CharacterSelection from './components/CharacterSelection/CharacterSelection';
import CharacterDesign from './components/CharacterSelection/CharacterDesign/CharacterDesign'
import BattleCalculator from './components/BattleCalculator/BattleCalculator';
import BattleSimulator from './components/BattleCalculator/BattleSimulator/BattleSimulator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/item-builder" element={<ItemBuilder />} />
        <Route path="/character-selection" element={<CharacterSelection />} />
        <Route path="/character-selection/character-design/:name" element={<CharacterDesign />} />
        <Route path="/battle-calculator" element={<BattleCalculator />} />
        <Route path="/battle-calculator/battle-simulator/:name" element={<BattleSimulator />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
