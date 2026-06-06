import { supabase } from "../lib/supabase";
import { Appointments } from "../store/useAppointmentStore";

export async function registerAppointmen(appointmentData: Appointments) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("appointmentData", appointmentData);

    const { data: appointment, error: ownerError } = await supabase
      .from("appointments")
      .insert({
        pet_id: appointmentData?.pet_id,
        veterinarian_id: user?.id,
        date: appointmentData.date,
        reason: appointmentData.reason,
        date_end: appointmentData.date_end,
      })
      .select()
      .single();

    if (ownerError) {
      throw new Error(ownerError.message);
    }

    return {
      success: true,
      appointment,
    };
  } catch (error) {
    console.error("registerPet error:", error);
    throw error;
  }
}
