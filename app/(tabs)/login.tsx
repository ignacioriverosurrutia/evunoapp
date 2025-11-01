import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '../context/AuthContext';
// Color used for button text and activity indicator for consistent contrast
const BUTTON_TEXT_COLOR = '#ffffff';

export default function Login() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const passwordRef = useRef<TextInput | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const validate = () => {
		setError('');
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (!emailRegex.test(email)) {
			setError('Por favor ingresa un email válido.');
			return false;
		}
		if (!password || password.length === 0) {
			setError('Ingresa la contraseña.');
			return false;
		}
		return true;
	};

	const { setEmail: setAuthEmail } = useAuth();

	const onLoginPress = () => {
		if (!validate()) return;

		// Validación adicional: contraseña correcta
		if (password !== '1234') {
			setError('Contraseña incorrecta');
			return;
		}

		setLoading(true);
		// Navegar a la vista principal (reemplaza la ruta actual)
		setTimeout(() => {
			setLoading(false);
			// Guardar email en contexto para que otras pestañas (Perfil) puedan leerlo
			setAuthEmail(email);
			setEmail('');
			setPassword('');
			// Reemplazamos la ruta por la pantalla principal del layout de tabs
			(router as any).replace('/');
		}, 600);
	};

	const isDisabled = loading || email.length === 0 || password.length === 0;

	return (
		<ThemedView style={styles.container}>
			<View style={styles.card}>
				<ThemedText type="title" style={styles.title}>
					Iniciar sesión
				</ThemedText>
				<View style={styles.field}>
					<ThemedText style={styles.label}>Email</ThemedText>
					<TextInput
						style={styles.input}
						placeholder="tu@correo.com"
						placeholderTextColor="#8e8e93"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={text => {
							setEmail(text);
							if (error) setError('');
						}}
						returnKeyType="next"
						onSubmitEditing={() => passwordRef.current?.focus()}
						editable={!loading}
						accessibilityLabel="Email"
					/>
				</View>

					<View style={styles.field}>
						<ThemedText style={styles.label}>Contraseña</ThemedText>
						<View style={styles.row}>
							<TextInput
								style={[styles.input, styles.inputWithButton]}
								placeholder="Contraseña"
								placeholderTextColor="#8e8e93"
								secureTextEntry={!showPassword}
								ref={passwordRef}
								value={password}
								onChangeText={text => {
									setPassword(text);
									if (error) setError('');
								}}
								editable={!loading}
								accessibilityLabel="Contraseña"
							/>
							<Pressable
								onPress={() => setShowPassword(v => !v)}
								style={styles.eyeButton}
								accessibilityRole="button"
								accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
							>
								<MaterialIcons
									name={showPassword ? 'visibility' : 'visibility-off'}
									size={20}
									color={styles.eyeText.color}
								/>
							</Pressable>
						</View>
					</View>

						{error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
						{/** Hint: demo password info */}
						<ThemedText style={styles.hint}>Demo: usa la contraseña 1234 para entrar</ThemedText>

							<Pressable
								onPress={onLoginPress}
								style={({ pressed }) => [
									styles.button,
									isDisabled ? styles.buttonDisabled : null,
									pressed ? styles.buttonPressed : null,
								]}
								disabled={isDisabled}
								accessibilityRole="button"
								accessibilityLabel="Iniciar sesión"
								accessibilityState={{ disabled: isDisabled }}
								testID="login-button"
								hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
								android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
							>
								{loading ? (
									<ActivityIndicator color={BUTTON_TEXT_COLOR} />
								) : (
									<ThemedText style={styles.buttonText}>Entrar</ThemedText>
								)}
							</Pressable>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 24,
	},
	card: {
		backgroundColor: 'rgba(255,255,255,0.02)',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 10,
	},
	title: {
		marginBottom: 16,
	},
	label: {
		marginTop: 8,
		marginBottom: 6,
	},
	input: {
		height: 44,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		paddingHorizontal: 12,
		marginBottom: 6,
		color: '#000',
		backgroundColor: 'transparent',
	},
	button: {
		marginTop: 12,
		backgroundColor: '#0a84ff',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		alignSelf: 'stretch',
		justifyContent: 'center',
	},
	buttonPressed: {
		opacity: 0.85,
		transform: [{ scale: 0.997 }],
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: BUTTON_TEXT_COLOR,
		fontWeight: '600',
	},
	error: {
		color: '#b00020',
		marginTop: 6,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputWithButton: {
		flex: 1,
		marginRight: 8,
	},
	field: {
		marginBottom: 12,
	},
	hint: {
		fontSize: 12,
		color: '#6e6e73',
		marginTop: 8,
	},
	eyeButton: {
		justifyContent: 'center',
		paddingHorizontal: 6,
		paddingVertical: 6,
		borderRadius: 6,
	},
	eyeText: {
		color: '#0a84ff',
		fontWeight: '600',
	},
});

