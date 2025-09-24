import WeaponBuilder from './WeaponBuilder/WeaponBuilder';
import SpellBuilder from './SpellBuilder/SpellBuilder';
import './ItemBuilder.css';

function ItemBuilder() {
  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="row w-100">
                {/* Weapon Builder on the left */}
                <div className="col-md-6 d-flex justify-content-center">
                    <WeaponBuilder />
                </div>

                {/* Spell Builder on the right */}
                <div className="col-md-6 d-flex justify-content-center">
                    <SpellBuilder />
                </div>
            </div>
        </div>
  );
}

export default ItemBuilder;
