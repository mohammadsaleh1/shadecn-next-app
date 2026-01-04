import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import LoginPage from './page'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/use-auth-store'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}))

// Mock next/link to behave like a normal anchor tag in tests
vi.mock('next/link', () => {
    return {
        __esModule: true,
        default: ({ children, href, ...props }: any) => {
            return <a href={href} {...props}>{children}</a>
        }
    }
})

// Mock useAuthStore
vi.mock('@/store/use-auth-store', () => ({
    useAuthStore: vi.fn(),
}));

describe('LoginPage', () => {
    let mockLogin: any;
    let mockPush: any;

    beforeEach(() => {
        mockLogin = vi.fn();
        mockPush = vi.fn();

        // Setup useRouter mock
        (useRouter as any).mockReturnValue({
            push: mockPush,
        });

        // Setup useAuthStore mock default return value
        // This mocks the hook call: const { login, isLoading, error } = useAuthStore()
        (useAuthStore as any).mockReturnValue({
            login: mockLogin,
            isLoading: false,
            error: null,
        });
    });

    it('renders login form correctly', () => {
        render(<LoginPage />);

        // Check for title
        expect(screen.getByText('Sign in')).toBeDefined()

        // Check for inputs
        expect(screen.getByLabelText(/email/i)).toBeDefined()
        expect(screen.getByLabelText(/password/i)).toBeDefined()

        // Check for button
        expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
    })

    it('calls login and redirects to dashboard on successful submission', async () => {
        mockLogin.mockResolvedValueOnce(undefined) // Simulate successful login

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        // Fill in the form
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        // Submit
        fireEvent.click(submitButton)

        // Verify login was called with correct credentials
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')

        // Verify redirect happens
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('displays loading state when logging in', () => {
        // Override mock to return isLoading: true
        (useAuthStore as any).mockReturnValue({
            login: mockLogin,
            isLoading: true,
            error: null,
        })

        render(<LoginPage />)

        expect(screen.getByText(/signing in.../i)).toBeDefined()
        // Check if button is disabled
        const button = screen.getByRole('button', { name: /signing in/i })
        expect(button.hasAttribute('disabled')).toBe(true)
    })

    it('displays error message when login fails and does not redirect', async () => {
        // Override mock to return an error
        (useAuthStore as any).mockReturnValue({
            login: mockLogin,
            isLoading: false,
            error: 'Invalid credentials',
        })

        render(<LoginPage />)

        expect(screen.getByText('Invalid credentials')).toBeDefined()

        // Ensure we didn't redirect (though this test case basically assumes static state, 
        // real interactions would drive the state change. But here we just test the render state)
        expect(mockPush).not.toHaveBeenCalled()
    })
})
