import cp from 'child_process';
import ora from 'ora';

const installComponents = () => {
    // Spinner başlat
    const spinner = ora('Installing components...').start();

    try {
        cp.execSync(`npx shadcn-ui@latest add button badge card label input toast checkbox dropdown-menu sheet dialog select textarea table`, { stdio: 'inherit' });
        spinner.succeed('Components installed successfully'); // İşlem başarılı olursa spinnerı durdur ve başarılı mesajı göster
    } catch (error) {
        spinner.fail('Failed to install components'); // Hata olursa spinnerı durdur ve hata mesajı göster
        console.error(error);
    }
};

export default installComponents;