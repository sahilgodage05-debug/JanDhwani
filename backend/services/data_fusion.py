import os
import sqlite3

def get_db_connection():
    # Use absolute path to ensure we can connect from anywhere
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, 'data', 'demographics.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def get_final_priority_score(district: str, base_severity: int) -> float:
    """
    Combines the AI's base severity (1-10) with National Demographic Data from SQLite DB.
    Formula: Base Severity + (Poverty Bonus) + (Population Bonus) - (Infra Access Penalty)
    """
    print(f"[DATA FUSION] Fetching demographic & infra data for district: {district} from Real DB")
    
    # Connect to the local SQLite database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT poverty_index, infra_access_score, population_density_index FROM district_data WHERE district = ?", (district,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            poverty_index = row['poverty_index']
            infra_access_score = row['infra_access_score']
            population_density_index = row['population_density_index']
        else:
            print(f"  -> District '{district}' not found in DB. Using defaults.")
            poverty_index = 0.4
            infra_access_score = 0.5
            population_density_index = 0.5
            
    except Exception as e:
        print(f"  -> Database error: {e}. Using defaults.")
        poverty_index = 0.4
        infra_access_score = 0.5
        population_density_index = 0.5
    
    # Algorithm: 
    # Max Poverty Bonus: +3.0 points (highly vulnerable areas get priority)
    # Max Population Bonus: +1.5 points (areas with more people affected get priority)
    # Max Infra Penalty: -2.0 points (already developed areas get slightly lower priority)
    
    poverty_bonus = poverty_index * 3.0
    population_bonus = population_density_index * 1.5
    infra_penalty = infra_access_score * 2.0
    
    final_score = base_severity + poverty_bonus + population_bonus - infra_penalty
    
    # Clamp between 1.0 and 10.0 (10 being absolute emergency)
    final_score = max(1.0, min(10.0, final_score))
    
    print(f"  -> Base AI Severity: {base_severity}")
    print(f"  -> Poverty Index ({poverty_index}) -> Bonus: +{poverty_bonus:.1f}")
    print(f"  -> Population Index ({population_density_index}) -> Bonus: +{population_bonus:.1f}")
    print(f"  -> Infra Access ({infra_access_score}) -> Penalty: -{infra_penalty:.1f}")
    print(f"  -> FINAL FUSION SCORE: {final_score:.1f}")
    
    return round(final_score, 1)
