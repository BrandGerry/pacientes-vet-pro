import { supabase } from "../lib/supabase";
import { Owners, Pets } from "../store/usePetsStore";

export async function registerPet(ownerData: Owners, petData: Pets) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { data: owner, error: ownerError } = await supabase
      .from("owners")
      .insert({
        user_id: user?.id,
        name: ownerData.name,
        email: ownerData.email,
        phone: ownerData.phone,
        address: ownerData.address,
        notes: ownerData.notes,
      })
      .select()
      .single();

    if (ownerError) {
      throw new Error(ownerError.message);
    }

    const { data: pet, error: petError } = await supabase
      .from("pets")
      .insert({
        owner_id: owner.id,
        name: petData.name,
        specie: petData.specie,
        breed: petData.breed,
        owner_name: ownerData.name,
        sex: petData.sex,
        birth_date: petData.birth_date,
        weight: petData.weight,
        color: petData.color,
        blood_type: petData.blood_type,
        sterilized: petData.sterilized,
        user_id: user?.id,
        last_visit: new Date(),
      })
      .select()
      .single();

    if (petError) {
      throw new Error(petError.message);
    }

    if (petData.medical) {
      const { error: medicalError } = await supabase.from("medical").insert({
        pet_id: pet.id,
        veterinarian_id: user?.id,
        symptoms: petData.medical.symptoms,
        diagnosis: petData.medical.diagnosis,
        treatment: petData.medical.treatment,
        notes: petData.medical.notes,
      });

      if (medicalError) {
        throw new Error(medicalError.message);
      }
    }

    if (petData.vaccines && petData.vaccines.length > 0) {
      const vaccinesToInsert = petData.vaccines.map((vaccine) => ({
        pet_id: pet.id,
        vaccine_name: vaccine.vaccine_name,
        aplication_date: vaccine.aplication_date,
        next_dose_date: vaccine.next_dose_date,
        notes: vaccine.notes,
      }));

      const { error: vaccineError } = await supabase
        .from("vaccines")
        .insert(vaccinesToInsert);

      if (vaccineError) {
        throw new Error(vaccineError.message);
      }
    }

    return {
      success: true,
      owner,
      pet,
    };
  } catch (error) {
    console.error("registerPet error:", error);

    throw error;
  }
}
