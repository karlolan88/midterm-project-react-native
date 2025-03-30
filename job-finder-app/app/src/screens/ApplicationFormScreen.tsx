import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

interface Job {
  id: string;
  title: string;
  companyName?: string;
}

const ApplicationFormScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { job, fromSavedJobs } = route.params as { job: Job; fromSavedJobs?: boolean };

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");

  // Error Messages
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");

  // Email Validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Contact Number Validation (Philippines: 11 digits, only numbers)
  const isValidContact = (contact: string) => /^[0-9]{11}$/.test(contact);

  // Handle form submission
  const handleSubmit = () => {
    if (!name || !email || !contact || !reason) {
      return; // Prevent submission if any field is empty
    }

    if (emailError || contactError) {
      return; // Prevent submission if there are validation errors
    }

    alert(`Application for ${job.title} at ${job.companyName} has been submitted!`);
    
    setName("");
    setEmail("");
    setContact("");
    setReason("");

    if (fromSavedJobs) {
      navigation.navigate("JobFinder"); // Redirect back to Job Finder if from Saved Jobs
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Apply for {job.title}</Text>
      <Text style={styles.companyName}>Company: {job.companyName}</Text>

      {/* Full Name */}
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        value={name} 
        onChangeText={setName} 
      />

      {/* Email Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
        value={email} 
        onChangeText={(text) => setEmail(text)}
        onBlur={() => setEmailError(!isValidEmail(email) ? "Invalid email, try again" : "")}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Contact Number Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Contact Number" 
        keyboardType="phone-pad" 
        maxLength={11} 
        value={contact} 
        onChangeText={(text) => setContact(text)}
        onBlur={() => setContactError(!isValidContact(contact) ? "Invalid contact number, must be 11 digits" : "")}
      />
      {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}

      {/* Reason Input */}
      <TextInput 
        style={[styles.input, styles.reasonInput]} 
        placeholder="Why should we hire you?" 
        multiline 
        value={reason} 
        onChangeText={setReason} 
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Application</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  companyName: { fontSize: 18, marginBottom: 10, color: "#333" },
  input: { 
    height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, 
    paddingHorizontal: 10, backgroundColor: "#fff", marginBottom: 5 
  },
  reasonInput: { height: 100, textAlignVertical: "top" },
  errorText: { color: "red", fontSize: 14, marginBottom: 10 },
  submitButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});

export default ApplicationFormScreen;
