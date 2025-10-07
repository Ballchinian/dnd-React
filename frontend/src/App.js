import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import ItemBuilder from './components/ItemBuilder/ItemBuilder';
import CharacterSelection from './components/CharacterSelection/CharacterSelection';
import CharacterDesign from './components/CharacterDesign/CharacterDesign'
import BattleCalculator from './components/BattleCalculator/BattleCalculator';
import BattleSimulator from './components/BattleSimulator/BattleSimulator';
import Layout from './components/Navbar/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/item-builder" element={<Layout><ItemBuilder /></Layout>} />
        <Route path="/character-selection" element={<Layout><CharacterSelection /></Layout>} />
        <Route path="/character-selection/character-design/:name" element={<Layout><CharacterDesign /></Layout>} />
        <Route path="/battle-calculator" element={<Layout><BattleCalculator /></Layout>} />
        <Route path="/battle-calculator/battle-simulator" element={<Layout><BattleSimulator /></Layout>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
